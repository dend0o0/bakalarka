<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    //
    protected $fillable = ['name', 'category_id'];
    public function shoppingListItems() {
        return $this->hasMany(ShoppingListItem::class);
    }

    public function category() {
        return $this->belongsTo(ItemCategory::class);
    }
}
