<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use App\Enums\ShipmentStatus;

class StoreShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // auth/verified middleware already protects the routes
        return true;
    }

    public function rules(): array
    {
        return [
            'status'              => ['required', new Enum(ShipmentStatus::class)],
            'cargo_sailing_date'  => ['nullable', 'date'],
            'eta'                 => ['nullable', 'date', 'after_or_equal:cargo_sailing_date'],
            'vessel_id'           => ['nullable', 'ulid', Rule::exists('vessels', 'id')],
            'origin_id'           => ['required', 'ulid', Rule::exists('locations', 'id')],
            'destination_id'      => ['required', 'ulid', Rule::exists('locations', 'id'), 'different:origin_id'],
            'actor_id'            => ['nullable', 'ulid', Rule::exists('users', 'id')],
            'reason'              => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Normalize empty strings to null for optional fields
        $this->merge([
            'cargo_sailing_date' => $this->emptyToNull($this->input('cargo_sailing_date')),
            'eta'                => $this->emptyToNull($this->input('eta')),
            'vessel_id'          => $this->emptyToNull($this->input('vessel_id')),
            'origin_id'          => $this->emptyToNull($this->input('origin_id')),
            'destination_id'     => $this->emptyToNull($this->input('destination_id')),
            'actor_id'           => $this->emptyToNull($this->input('actor_id')),
            'reason'             => $this->emptyToNull($this->input('reason')),
        ]);
    }

    private function emptyToNull($value)
    {
        return $value === '' ? null : $value;
    }

    public function attributes(): array
    {
        return [
            'eta' => 'ETA',
        ];
    }
}
