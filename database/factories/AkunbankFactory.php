<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Akunbank>
 */
class AkunbankFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_bank' => fake()->unique()->randomElement($array = array('Tunai','BCA','BNI', 'BRI', 'MANDIRI')),
            
        ];
    }
}
