<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemPairs;
use App\Models\ShoppingListItem;
use Illuminate\Http\Request;
use App\AI\CategoriesAssignment;

class ShoppingListItemController extends Controller
{

    public function index()
    {
        //
        return ShoppingListItem::with('item')->orderBy('checked')->get();
    }

    /**
     * Store a newly created resource in storage.
     */

    // Vyhladanie polozky
    public function search(Request $request) {
        $search = $request->query('q');
        return Item::where('name', 'LIKE', "%{$search}%")->limit(5)->get();
    }

    /**
     * Ulozenie polozky vratane overenia existencie
     */
    public function store(Request $request, $id)
    {

        $item = Item::where('name', $request->name)->first();

        if (!$item) {
            $categorizer = new CategoriesAssignment();
            $categories = ItemCategory::all();

            $item = Item::create([
                'name' => $request->name,
                'category_id' => $categorizer->assignCategory($request->name, $categories),
            ]);
        }

        $shoppingListItem = ShoppingListItem::create([
            'item_id' => $item->id,
            'shopping_list_id' => $id
        ]);

        return response()->json([
            'item' => ShoppingListItem::with(['item', 'item.category'])->find($shoppingListItem->id)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ShoppingListItem $item)
    {
        $request->validate([
            'name' => 'nullable|string|max:30',
            'checked' => 'required|boolean'
        ]);
        $maxOrder = ShoppingListItem::where('shopping_list_id', $item->shopping_list_id)->max('order');

        if ($request->checked === true) {
            $item->update([
                'checked' => $request->checked,
                'checked_at' => now(),
                'order' => $maxOrder != null ? $maxOrder + 1 : 1
            ]);

            return response()->json(['message' => 'Políčko zaškrtnuté', 'name' => $item, 'max_order' => $maxOrder, 'shop' => $request->all()]);
        }

        $itemOrder = $item->order;

        if ($itemOrder !== null) {
            ShoppingListItem::where('shopping_list_id', $item->shopping_list_id)->where('order', '>', $itemOrder)->decrement('order');
        }


        $item->update([
            'checked' => $request->checked,
            'checked_at' => null,
            'order' => null
        ]);

        return response()->json(['message' => 'Zaškrutnutie zrušené', 'name' => $item]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $item = ShoppingListItem::find($id);
        $item->delete();
        return response()->json(['message' => 'Položka bola odstránená zo zoznamu']);
    }
}
