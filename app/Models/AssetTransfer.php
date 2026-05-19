<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetTransfer extends Model
{
    protected $fillable = [
        'asset_id', 'from_user_id', 'to_user_id',
        'requested_by', 'reviewed_by', 'status',
        'reason', 'rejection_reason', 'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function asset()     { return $this->belongsTo(Asset::class); }
    public function fromUser()  { return $this->belongsTo(User::class, 'from_user_id'); }
    public function toUser()    { return $this->belongsTo(User::class, 'to_user_id'); }
    public function requester() { return $this->belongsTo(User::class, 'requested_by'); }
    public function reviewer()  { return $this->belongsTo(User::class, 'reviewed_by'); }
}