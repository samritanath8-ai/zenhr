<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AssetDepreciation extends Model
{
    protected $fillable = [
        'asset_id', 'method', 'purchase_price', 'salvage_value',
        'useful_life_years', 'declining_rate', 'total_units',
        'units_used', 'depreciation_start',
    ];

    protected $casts = [
        'purchase_price'   => 'decimal:2',
        'salvage_value'    => 'decimal:2',
        'declining_rate'   => 'decimal:2',
        'depreciation_start' => 'date',
    ];

    public function asset() { return $this->belongsTo(Asset::class); }

    /**
     * Returns current book value and accumulated depreciation.
     */
    public function calculate(): array
    {
        $purchase   = (float) $this->purchase_price;
        $salvage    = (float) $this->salvage_value;
        $start      = Carbon::parse($this->depreciation_start);
        $yearsElapsed = max(0, $start->diffInDays(now()) / 365.25);

        switch ($this->method) {
            case 'straight_line':
                $life = $this->useful_life_years ?? 1;
                $annualDep = ($purchase - $salvage) / $life;
                $accumulated = min($annualDep * $yearsElapsed, $purchase - $salvage);
                break;

            case 'declining_balance':
                $rate = ($this->declining_rate ?? 20) / 100;
                $accumulated = $purchase - ($purchase * pow(1 - $rate, $yearsElapsed));
                $accumulated = min($accumulated, $purchase - $salvage);
                break;

            case 'units_of_production':
                $total = $this->total_units ?? 1;
                $used  = $this->units_used ?? 0;
                $accumulated = (($purchase - $salvage) / $total) * $used;
                break;

            default:
                $accumulated = 0;
        }

        $accumulated = round(max(0, $accumulated), 2);
        $bookValue   = round(max($salvage, $purchase - $accumulated), 2);
        $percentUsed = $purchase > 0 ? round(($accumulated / $purchase) * 100, 1) : 0;

        return [
            'book_value'   => $bookValue,
            'accumulated'  => $accumulated,
            'percent_used' => $percentUsed,
        ];
    }
}