<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoppingListItem extends Model
{
    //
    protected $fillable = ['item_id', 'checked', 'checked_at', 'shopping_list_id', 'order'];

    public function item() {
        return $this->belongsTo(Item::class);
    }

    public function shoppingList() {
        return $this->belongsTo(ShoppingList::class);
    }
}
