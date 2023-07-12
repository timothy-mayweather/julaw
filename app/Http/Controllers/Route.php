<?php

namespace App\Http\Controllers;

class Route extends \Illuminate\Support\Facades\Route
{
    public static function resource(string $name, string $controller, array $options = []): \Illuminate\Routing\Route
    {
      return self::resourceRoutes($name, $controller);
    }

    public static function apiResource(string $name, string $controller, array $options = []): \Illuminate\Routing\Route
    {
      return self::resourceRoutes($name, $controller);
    }

  /**
   * @param string $name
   * @param string $controller
   * @return \Illuminate\Routing\Route
   */
  public static function resourceRoutes(string $name, string $controller): \Illuminate\Routing\Route
  {
    parent::get('/' . $name, [$controller, 'index'])->name($name . '.index');
    parent::post('/' . $name, [$controller, 'store'])->name($name . '.store');
    parent::get('/' . $name . '/{val}', [$controller, 'show'])->name($name . '.show');
    parent::post('/' . $name . '/update', [$controller, 'update'])->name($name . '.update');
    return parent::post('/' . $name . '/destroy', [$controller, 'destroy'])->name($name . '.destroy');
  }
}
