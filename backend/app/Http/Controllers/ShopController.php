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
     * Ziskanie vsetkych obchodov pouzivatela
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json($user->shops);
    }

    /**
     * Ziskanie vsetych obchodov (pre administrativne ucely)
     */
    public function indexAll() {
        $shops = Shop::all();
        return response()->json($shops);
    }

    /**
     * Vytvorenie noveho obchodu aj s overenim, ci uz obchod existuje
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
    }

    /**
     * Ziskanie informacii o konkretnom obchode
     */
    public function show(string $id)
    {
        return response()->json(Shop::find($id));
    }

    /**
     * Odstranenie obchodu pre jedneho pouzivatela (nie uplne odstranenie)
     */
    public function destroy(string $id)
    {
        //
        $shop = Shop::find($id);
        $user = Auth::user();
        $user->shops()->detach($shop->id);
        return response()->json("Obchod bol odstránený", 201);
    }


    /**
     * Vyhladanie obchodu podla mena (pre navrhy)
     */
    public function search(Request $request) {
        $search = $request->query('q');
        return response()->json(Shop::where('name', 'LIKE', "%{$search}%")->limit(5)->get());
    }

    /**
     * Uplne odstranenie obchodu z databazy
     */
    public function remove(string $id) {
        $shop = Shop::find($id);
        $shop->delete();
        return response()->json("Obchod bol vymazaný");
    }
}
