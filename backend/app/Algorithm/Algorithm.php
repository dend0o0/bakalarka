<?php

namespace App\Algorithm;

use App\Models\ShoppingList;
use Illuminate\Support\Facades\Auth;

class Algorithm
{
    private $shoppingLists;
    private $shop_id;
    private $items;

    public function __construct($items)
    {
        // Nacitanie pouzivanych zoznamov podla toho, kolko ma pouzivatel vytvorenych zoznamov
        $this->items = $items;
        $shop_id = $items->shop_id;
        $this->shoppingLists = ShoppingList::with('items.item')
            ->withCount('items')
            ->whereHas('items', function ($query) use ($shop_id) {
                $query->where('checked', 1);
            })
            ->where('shop_id', $shop_id)
            ->where('user_id', Auth::id())
            ->orderBy('items_count', 'desc')
            ->limit(50)
            ->get();

        if (count($this->shoppingLists) < 3) {
            $this->shoppingLists = ShoppingList::with('items.item')
                ->withCount('items')
                ->whereHas('items', function ($query) use ($shop_id) {
                    $query->where('checked', 1);
                })
                ->where('shop_id', $shop_id)
                ->orderBy('items_count', 'desc')
                ->limit(50)
                ->get();
        }
    }

    public function sort()
    {
        $items = $this->items;
        $historicalOrders = [];
        $categoryOrders = [];

        // Ulozenie zoznamov do struktury (cez item sa vieme dostat na zoznamy a cez zoznam na poradie ([item][list])
        foreach ($this->shoppingLists as $list) {
            foreach ($list->items as $item) {
                $historicalOrders[$item->item_id][$list->id] = $item->order;
                if (!isset($categoryOrders[$item->item->category_id][$list->id])) {
                    $categoryOrders[$item->item->category_id][$list->id] = $item->order;
                }
            }
        }

        // Vykonanie bubblesort algoritmu
        for ($i = 0; $i < count($items->items); $i++) {
            $swapped = false;
            for ($j = 0; $j < count($items->items) - $i - 1; $j++) {
                if ($this->compare($items->items[$j], $items->items[$j + 1], $historicalOrders, $categoryOrders)) {
                    $temp = $items->items[$j];
                    $items->items[$j] = $items->items[$j + 1];
                    $items->items[$j + 1] = $temp;
                    $swapped = true;
                }
            }
            if (!$swapped) {
                break;
            }
        }
        return $items;
    }

    public function compare($item1, $item2, $historicalOrders, $categoryOrders)
    {
        // Porovnavaju sa dva konkretne tovary, ktore sa nachadzaju v jednom zozname
        $result = $this->compareOrders($item1->item_id, $item2->item_id, $historicalOrders);

        if (!is_null($result)) {
            return $result;
        }


        // Porovnavanie susedov - skusame najst nejaky tovar, co je susedom s oboma porovnavanymi tovarmi v roznych zoznamoch a na zaklade toho urcime,
        // ktory by mal ist skor
        $result = $this->compareNeighbors($item1->item_id, $item2->item_id, $historicalOrders);
        if (!is_null($result)) {
            return $result;
        }


        // Porovnavanie kategorii v pripade, ze nevieme vyhodnotit konkretne tovary
        $result = $this->compareOrders($item1->item->category_id, $item2->item->category_id, $categoryOrders);
        if (!is_null($result)) {
            return $result;
        }

        // Osetrenie toho, ked uz nevieme najst ani dvojicu kategorii
        $unknown1 = empty($historicalOrders[$item1->item_id]) && empty($categoryOrders[$item1->item->category_id]);
        $unknown2 = empty($historicalOrders[$item2->item_id]) && empty($categoryOrders[$item2->item->category_id]);

        if ($unknown1 && !$unknown2) {
            return false;
        }

        if ($unknown2 && !$unknown1) {
            return true;
        }


        return false;
    }

    private function compareOrders($id1, $id2, $orders)
    {
        // Hladame zoznamy, kde su oba itemy a potom zistujeme, kolkokrat bol ktory item pred druhym
        if (!empty($orders[$id1]) && !empty($orders[$id2])) {
            $countItem1Before = 0;
            $countItem2Before = 0;

            foreach ($orders[$id1] as $listId => $order1) {
                if (isset($orders[$id2][$listId])) {
                    $order2 = $orders[$id2][$listId];

                    if ($order1 > $order2) {
                        $countItem1Before++;
                    } elseif ($order1 < $order2) {
                        $countItem2Before++;
                    }
                }
            }

            if ($countItem1Before != 0 || $countItem2Before != 0) {
                    return $countItem1Before >= $countItem2Before;
            }
            return null;
        }
        return null;

    }

    private function compareNeighbors($id1, $id2, $orders)
    {
        $neighbors1 = [];
        $neighbors2 = [];

        if (!empty($orders[$id1]) && !empty($orders[$id2])) {
            // Hladaju sa spolocne itemy pre prvy item
            foreach ($orders[$id1] as $listId => $order1) {
                foreach ($orders as $itemId => $otherOrders) {
                    if (isset($otherOrders[$listId]) && $otherOrders[$listId] != $order1) {
                        $neighbors1[] = $itemId;
                    }
                }
            }

            // Hladaju sa spolocne itemy pre druhy item
            foreach ($orders[$id2] as $listId => $order2) {
                foreach ($orders as $itemId => $otherOrders) {
                    if (isset($otherOrders[$listId]) && $otherOrders[$listId] != $order2) {
                        $neighbors2[] = $itemId;
                    }
                }
            }

            // Prechadzame spolocne itemy a zistujeme, ci maju neighbors1 a neighbors2 nejaky spolocny item
            foreach ($neighbors1 as $neighbor1) {
                if (isset($orders[$neighbor1])) {

                    foreach ($neighbors2 as $neighbor2) {
                        // Tu zistujeme, ci je spolocny sused
                        if (isset($orders[$neighbor2]) && $neighbor1 == $neighbor2) {

                            $greater1 = false;
                            $smaller1 = false;
                            $greater2 = false;
                            $smaller2 = false;

                            // Porovnavaju sa predmety relativne na zaklade zisteneho predmetu
                            foreach ($orders[$neighbor1] as $listId => $order1) {

                                if (isset($orders[$neighbor1][$listId]) && isset($orders[$id1][$listId])) {
                                    if ($orders[$neighbor1][$listId] > $orders[$id1][$listId]) {

                                        $greater1 = true;
                                    } else if ($orders[$neighbor1][$listId] < $orders[$id1][$listId]) {

                                        $smaller1 = true;
                                    }
                                } else if (isset($orders[$neighbor2][$listId]) && isset($orders[$id2][$listId])) {
                                    if ($orders[$neighbor2][$listId] > $orders[$id2][$listId]) {
                                        $greater2 = true;
                                    } else if ($orders[$neighbor2][$listId] < $orders[$id2][$listId]) {
                                        $smaller2 = true;
                                    }
                                }
                                if ($smaller1 && $greater2) {
                                    return true;
                                }
                                if ($smaller2 && $greater1) {
                                    return false;
                                }
                            }
                        }
                    }
                }

            }
        }
        return null;
    }
}
