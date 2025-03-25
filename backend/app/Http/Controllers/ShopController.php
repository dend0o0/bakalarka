<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json($user->shops);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $shop = Shop::where('name', $request->name)->first();
        $user = Auth::user();
        if (!$shop) {
            $shop = Shop::create([
                'name' => $request->name,
                'city' => $request->city,
                'address' => $request->address
            ]);
        }
        if (!$user->shops()->where('shop_id', $shop->id)->exists()) {
            $user->shops()->attach($shop->id);
        }
        return response()->json($shop, 201);


        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Shop::find($id));
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $shop = Shop::find($id);
        $user = Auth::user();
        $user->shops()->detach($shop->id);
        return response()->json("Obchod bol odstránený", 201);
    }

    public function search(Request $request) {
        $search = $request->query('q');
        return response()->json(Shop::where('name', 'LIKE', "%{$search}%")->limit(5)->get());
    }
}
