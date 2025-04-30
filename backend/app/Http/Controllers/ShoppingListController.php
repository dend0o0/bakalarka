<?php

namespace App\Http\Controllers;

use App\AI\CategoriesAssignment;
use App\Algorithm\Algorithm;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ShoppingList;
use App\Models\ShoppingListItem;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    // Ziskanie nakupnych zoznamov pouzivatela v obchode
    public function index($shop_id)
    {
        $lists = ShoppingList::where('shop_id', $shop_id)
            ->where('user_id', auth()->id())
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return response()->json($lists);

    }

    // Vytvorenie nakupneho zoznamu
    public function store(Request $request, $shop_id)
    {
        $shoppingList = ShoppingList::create([
            'shop_id' => $shop_id,
            'user_id' => auth()->id(),
        ]);

        return response()->json(['shopping_list' => $shoppingList]);

    }

    // Ziskanie nakupneho zoznamu aj s polozkami
    public function show(string $id)
    {
        $list =  ShoppingList::with('items.item', 'shop')->where('user_id', auth()->id())->find($id);
        return response()->json(['list' => $list]);
    }

    // Vymazanie zoznamu
    public function destroy(string $id) {
        $list = ShoppingList::find($id);
        $list->delete();
        return response()->json(['message' => 'Zoznam bol vymazaný']);
    }

    // Zoradenie poloziek v zozname
    public function sortList(Request $request, $list_id) {

        $items = ShoppingList::with('items.item')->find($list_id);
        $algorithm = new Algorithm($items);
        return response()->json($algorithm->sort());
    }
}
