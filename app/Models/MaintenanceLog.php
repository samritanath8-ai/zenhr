<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceLog extends Model
{
    protected $fillable = [
        'asset_id', 'logged_by', 'type', 'maintenance_date',
        'next_due', 'technician', 'cost', 'notes',
    ];

    protected $casts = [
        'maintenance_date' => 'date',
        'next_due'         => 'date',
        'cost'             => 'decimal:2',
    ];

    public function asset() { return $this->belongsTo(Asset::class); }
    public function logger() { return $this->belongsTo(User::class, 'logged_by'); }
}