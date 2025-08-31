<?php          
namespace App\Models;   

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Enums\ShipmentStatus;   

class ShipmentVersion extends Model
{
    use HasFactory, HasUlids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['shipment_id','status','cargo_sailing_date','eta','vessel_id','origin_id','destination_id','actor_id','version'];
    protected $casts = [
        'status'             =>  ShipmentStatus::class,
        'cargo_sailing_date' => 'date',
        'eta'                => 'date',
    ];

    public function vessel()       { return $this->belongsTo(Vessel::class); }
    public function origin()       { return $this->belongsTo(Location::class, 'origin_id'); }
    public function destination()  { return $this->belongsTo(Location::class, 'destination_id'); }
    public function shipment() { return $this->belongsTo(Shipment::class); }
}
