<?php

namespace App\AI;

use App\Models\Item;
use App\Models\ItemCategory;
use Gemini;
use Gemini\Client;
use Illuminate\Tests\Integration\Database\EloquentHasManyThroughTest\Category;


class CategoriesAssignment {
    private $client;

    public function __construct() {
        $this->client = Gemini::client(env('GEMINI_API_KEY'));
    }

    public function assignCategory($item, $categories) {

        $response = $this->client->geminiFlash()->generateContent("Do ktorej z týchto kategorii patri v obchode
            (ktora cast obchodu) {$item}? {$categories} Napis potom iba id danej kategorie.
            Ak by si nevedel, co to je za predmet, daj to vzdy ako Iné.
            Kategorie priraduj podla toho, ako by boli umiestnene v obchode.");
        return rtrim($response->text(), "\n");
    }
}
