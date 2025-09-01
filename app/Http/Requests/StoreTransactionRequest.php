<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        // If you have policies, call them here. For now, allow.
        return true;
    }

    public function rules(): array
    {
        return [
            // core transaction fields (customize to your schema)
            'name' => ['nullable', 'string', 'max:255'],

            // lines (optional array)
            'lines' => ['sometimes', 'array', 'min:1'],

            // each line
            'lines.*.name'       => ['required_with:lines', 'string', 'max:255'],
            'lines.*.quantity'   => ['required_with:lines', 'numeric', 'gt:0', 'decimal:0,2'],
            'lines.*.unit_price' => ['required_with:lines', 'numeric', 'gte:0', 'decimal:0,2'],
            'lines.*.line_number'=> ['sometimes', 'integer', 'min:1'],

            // things the client must NOT set
            'shipment_id'        => ['prohibited'],
            'lines.*.line_value' => ['prohibited'], // computed in model
        ];
    }

    public function messages(): array
    {
        return [
            'shipment_id.prohibited' => 'shipment_id is set from the route.',
            'lines.*.line_value.prohibited' => 'line_value is computed automatically.',
        ];
    }
}
