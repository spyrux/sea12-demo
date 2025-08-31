<?php
namespace App\Enums;

enum ShipmentStatus: string {
    case PLANNED = 'PLANNED';
    case IN_TRANSIT = 'IN_TRANSIT';
    case ARRIVED = 'ARRIVED';
    case CLOSED = 'CLOSED';
}