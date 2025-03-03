<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
    //
    protected $fillable = ['shop_id', 'user_id'];

    public function items() {
        return $this->hasMany(ShoppingListItem::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function shop() {
        return $this->belongsTo(Shop::class);
    }
}
