<?php
namespace App\Enums;

enum TransactionType: string {
    case PURCHASE = 'PURCHASE';
    case SALE = 'SALE';
    case FREIGHT = 'FREIGHT';
    case INSURANCE = 'INSURANCE';
}