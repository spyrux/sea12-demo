<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],

            'lines' => ['sometimes', 'array', 'min:1'],
            'lines.*.id'         => ['sometimes', 'string'], // if you patch existing lines
            'lines.*.name'       => ['sometimes', 'string', 'max:255'],
            'lines.*.quantity'   => ['sometimes', 'numeric', 'gt:0', 'decimal:0,2'],
            'lines.*.unit_price' => ['sometimes', 'numeric', 'gte:0', 'decimal:0,2'],
            'lines.*.line_number'=> ['sometimes', 'integer', 'min:1'],

            'shipment_id'        => ['prohibited'],
            'lines.*.line_value' => ['prohibited'],
        ];
    }
}
