<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use App\Enums\ShipmentStatus;

class UpdateShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status'              => ['sometimes', new Enum(ShipmentStatus::class)],
            'cargo_sailing_date'  => ['sometimes', 'nullable', 'date'],
            'eta'                 => ['sometimes', 'nullable', 'date', 'after_or_equal:cargo_sailing_date'],
            'vessel_id'           => ['sometimes', 'nullable', 'ulid', Rule::exists('vessels', 'id')],
            'origin_id'           => ['sometimes', 'nullable', 'ulid', Rule::exists('locations', 'id')],
            'destination_id'      => ['sometimes', 'nullable', 'ulid', Rule::exists('locations', 'id'), 'different:origin_id'],
            'actor_id'            => ['sometimes', 'nullable', 'ulid', Rule::exists('users', 'id')],
            'reason'              => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $map = [
            'cargo_sailing_date', 'eta', 'vessel_id',
            'origin_id', 'destination_id', 'actor_id', 'reason',
        ];

        $merged = [];
        foreach ($map as $key) {
            if ($this->has($key)) {
                $merged[$key] = $this->input($key) === '' ? null : $this->input($key);
            }
        }
        if ($merged) {
            $this->merge($merged);
        }
    }

    public function attributes(): array
    {
        return [
            'eta' => 'ETA',
        ];
    }
}
