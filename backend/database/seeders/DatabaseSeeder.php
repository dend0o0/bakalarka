<?php

namespace Database\Seeders;

use App\Models\ItemCategory;
use App\Models\Shop;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Shop::factory()->createShop("Kaufland Žilina", 'Vysoškolákov', 'Žilina')->create();
        Shop::factory()->createShop("Billa Dubeň", 'Vysoškolákov', 'Žilina')->create();
        //
        ItemCategory::factory()->createCategory("Ovocie")->create();
        ItemCategory::factory()->createCategory("Zelenina")->create();
        ItemCategory::factory()->createCategory("Zavárané ovocie")->create();
        ItemCategory::factory()->createCategory("Pečivo")->create();
        ItemCategory::factory()->createCategory("Konzervovaná a zaváraná zelenina")->create();
        ItemCategory::factory()->createCategory("Mäsové výrobky")->create();
        ItemCategory::factory()->createCategory("Surové mäso")->create();
        ItemCategory::factory()->createCategory("Výrobky z rýb")->create();
        ItemCategory::factory()->createCategory("Mliečne výrobky")->create();
        ItemCategory::factory()->createCategory("Vajcia")->create();
        ItemCategory::factory()->createCategory("Slané snacky")->create();
        ItemCategory::factory()->createCategory("Sladké snacky")->create();
        ItemCategory::factory()->createCategory("Drogéria v domácnosti")->create();
        ItemCategory::factory()->createCategory("Osobná drogéria")->create();
        ItemCategory::factory()->createCategory("Koreniny a dochucovadlá")->create();
        ItemCategory::factory()->createCategory("Konzervované mäsové výrobky a konzervované nátierky")->create();
        ItemCategory::factory()->createCategory("Múka")->create();
        ItemCategory::factory()->createCategory("Ryža")->create();
        ItemCategory::factory()->createCategory("Cestoviny")->create();
        ItemCategory::factory()->createCategory("Sladké vody")->create();
        ItemCategory::factory()->createCategory("Minerálne vody")->create();
        ItemCategory::factory()->createCategory("Alkohol")->create();
        ItemCategory::factory()->createCategory("Iné")->create();

        User::factory()->createUser('denis', 'denis@example.com', bcrypt('heslo123'))->create();
        User::factory()->createUser('anka', 'anka@example.com', bcrypt('heslo123'))->create();
        User::factory()->createUser('kika', 'kika@example.com', bcrypt('heslo123'))->create();



    }
}
