<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Party extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['name', 'type']; // e.g. COMPANY, INDIVIDUAL

    /* Relationships */
    public function transactions()
    {
        return $this->belongsToMany(Transaction::class, 'transaction_parties')
                    ->withPivot(['id', 'role'])   // BUYER/SELLER/CARRIER/...
                    ->withTimestamps();
    }

    // Optional role helpers
    public function buyerTransactions()
    {
        return $this->transactions()->wherePivot('role', 'BUYER');
    }

    public function sellerTransactions()
    {
        return $this->transactions()->wherePivot('role', 'SELLER');
    }
}
