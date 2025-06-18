<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kos extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'location',
        'includes',
        'nearby_facilities',
        'price_per_month',
        'images',
        'contact_whatsapp',
        'capacity'
    ];

    protected $casts = [
        'includes' => 'array',
        'nearby_facilities' => 'array',
        'images' => 'array'
    ];

    public function reviews() {
        return $this->hasMany(Review::class);
    }
}
