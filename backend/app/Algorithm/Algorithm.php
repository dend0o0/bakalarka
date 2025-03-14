<?php

namespace App\Algorithm;

use App\Models\ShoppingList;

class Algorithm {
    public function __construct() {

    }

    public function test($items) {
        $pocitadlo = 0;
        $porovnania = array();

        $shoppingLists = ShoppingList::with('items.item')
            ->whereHas('items', function ($query) {
                $query->where('checked', 1);
            })
            ->get();

        $historicalOrders = [];
        $categoryOrders = [];

        foreach ($shoppingLists as $list) {
            foreach ($list->items as $item) {
                $historicalOrders[$item->item_id][$list->id] = $item->order;
                $categoryOrders[$item->item->category_id][$list->id] = $item->order;
            }
        }

        for ($i = 0; $i < count($items->items); $i++) {
            $swapped = false;
            for ($j = 0; $j < count($items->items) - $i - 1; $j++) {
                array_push($porovnania, "Porovnavam " . $items->items[$j]->item->name . " s " . $items->items[$j + 1]->item->name);
                if ($this->compare($items->items[$j], $items->items[$j + 1], $historicalOrders, $categoryOrders) ) {
                    array_push($porovnania, "\tVymienam " . $items->items[$j]->item->name . " s " . $items->items[$j + 1]->item->name);
                    $temp = $items->items[$j];
                    $items->items[$j] = $items->items[$j + 1];
                    $items->items[$j + 1] = $temp;
                    $swapped = true;
                    $pocitadlo++;
                }
            }
            if (!$swapped) {
                break;
            }
        }
        return $items;
    }

    public function compare($item1, $item2, $historicalOrders, $categoryOrders) {

        // Porovnavaju sa dva konkretne tovary, ktore sa nachadzaju v jednom zozname
        if (!empty($historicalOrders[$item1->item_id]) && !empty($historicalOrders[$item2->item_id])) {
            foreach ($historicalOrders[$item1->item_id] as $listId => $order1) {
                if (isset($historicalOrders[$item2->item_id][$listId])) {
                    $order2 = $historicalOrders[$item2->item_id][$listId];
                    return $order1 > $order2;
                }
            }
        }

        // Porovnavanie kategorii v pripade, ze nevieme vyhodnotit konkretne tovary
        if (!empty($categoryOrders[$item1->item->category_id]) && !empty($categoryOrders[$item2->item->category_id])) {
            foreach ($categoryOrders[$item1->item->category_id] as $listId => $order1) {
                if (isset($categoryOrders[$item2->item->category_id][$listId])) {
                    $order2 = $categoryOrders[$item2->item->category_id][$listId];
                    return $order1 > $order2;
                }
            }
        }

        return true;

    }
}

