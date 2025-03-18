<?php

namespace App\Algorithm;

use App\Models\ShoppingList;
use Illuminate\Support\Facades\Auth;

class Algorithm {
    public function __construct() {

    }

    public function test($items) {
        $pocitadlo = 0;
        $porovnania = array();
        $shop_id = $items->shop_id;

        $shoppingLists = ShoppingList::with('items.item')
            ->whereHas('items', function ($query) use ($shop_id) {
                $query->where('checked', 1);
            })
            ->where('shop_id', $shop_id)
            ->where('user_id', Auth::id())
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

        // Porovnavanie susedov
        $neighbors1 = [];
        $neighbors2 = [];

        if (!empty($historicalOrders[$item1->item_id]) && !empty($historicalOrders[$item2->item_id])) {
            foreach ($historicalOrders[$item1->item_id] as $listId => $order1) {
                // Prechádzame cez historické objednávky
                foreach ($historicalOrders as $itemId => $orders) {
                    // Teraz máme správny $itemId, čo je kľúč v historicalOrders
                    if (isset($orders[$listId]) && ($orders[$listId] == $order1 - 1 || $orders[$listId] == $order1 + 1)) {
                        $neighbors1[] = $itemId;
                    }
                }
            }


            foreach ($historicalOrders[$item2->item_id] as $listId => $order2) {
                // Prechádzame cez historické objednávky
                foreach ($historicalOrders as $itemId => $orders) {
                    // Teraz máme správny $itemId, čo je kľúč v historicalOrders
                    if (isset($orders[$listId]) && ($orders[$listId] == $order2 - 1 || $orders[$listId] == $order2 + 1)) {
                        $neighbors2[] = $itemId;
                    }
                }
            }



            foreach ($neighbors1 as $neighbor1) {
                if (isset($historicalOrders[$neighbor1])) {

                    foreach ($neighbors2 as $neighbor2) {
                        if (isset($historicalOrders[$neighbor2]) && $neighbor1 == $neighbor2) {

                            $greater1 = false;
                            $smaller1 = false;
                            $greater2 = false;
                            $smaller2 = false;

                            foreach ($historicalOrders[$neighbor1] as $listId => $order1) {
                                //dd($historicalOrders[$item1->item_id], $historicalOrders[$item2->item_id], $historicalOrders[$neighbor1], $historicalOrders[$neighbor2], $neighbor1, $neighbor2);

                                if (isset($historicalOrders[$neighbor1][$listId]) && isset($historicalOrders[$item1->item_id][$listId])) {
                                    if ($historicalOrders[$neighbor1][$listId] > $historicalOrders[$item1->item_id][$listId]) {

                                        $greater1 = true;
                                    } else if ($historicalOrders[$neighbor1][$listId] < $historicalOrders[$item1->item_id][$listId]) {

                                        $smaller1 = true;
                                    }
                                } else if (isset($historicalOrders[$neighbor2][$listId]) && isset($historicalOrders[$item2->item_id][$listId])) {
                                    if ($historicalOrders[$neighbor2][$listId] > $historicalOrders[$item2->item_id][$listId]) {
                                        $greater2 = true;
                                    } else if ($historicalOrders[$neighbor2][$listId] < $historicalOrders[$item2->item_id][$listId]) {
                                        //dd($neighbor2, $item2->item_id, $historicalOrders[$neighbor2][$listId], $historicalOrders[$item2->item_id][$listId]);
                                        $smaller2 = true;
                                    }
                                }
                                if ($smaller1 && $greater2) {
                                    //dd($item1->item_id, $item2->item_id);
                                    return true;
                                }
                                if ($smaller2 && $greater1) {
                                    //dd($item1->item_id, $item2->item_id);
                                    return false;
                                }
                            }
                        }
                    }
                }

            }

            //dd($item1->item_id, $item2->item_id, $neighbors1, $neighbors2);

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

        // Ak uz nevieme co s itemom
        if (empty($historicalOrders[$item1->item_id]) && empty($categoryOrders[$item1->item->category_id])) {
            return true; // item1 nepozname, posunieme ho dopredu
        }
        if (empty($historicalOrders[$item2->item_id]) && empty($categoryOrders[$item2->item->category_id])) {
            return false; // item2 nepozname, posunieme ho dopredu
        }

        return true;

    }
}

