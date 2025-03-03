<?php

namespace App\AI;

use Gemini;
use Gemini\Client;



class CategoriesAssignment {
    private $client;

    public function __construct() {
        $this->client = Gemini::client(env('GEMINI_API_KEY'));
    }

    public function assignCategory($item, $categories) {

        $response = $this->client->geminiFlash()->generateContent("Do ktorej z týchto kategorii patri {$item}? {$categories} Napis potom iba id danej kategorie. Ak by si nevedel, co to je za predmet, daj to vzdy ako Iné.");
        return rtrim($response->text(), "\n");
    }
}
