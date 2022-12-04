<?php
namespace App\Http\Controllers;

trait Helpers{
    public function date_to_int(string $dateString): int
    {
        return (round(strtotime($dateString)/86400)+1);
    }
}
