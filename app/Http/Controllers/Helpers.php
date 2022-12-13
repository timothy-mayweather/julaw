<?php
namespace App\Http\Controllers;

trait Helpers{
    public function date_to_int(string $dateString): string
    {
        return (string)(round(strtotime($dateString) / 86400) + 1);
    }
}
