<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class Controller
{
    protected function prefix(Request $request): string
    {
        return $request->routeIs('agent.*') ? 'agent' : 'admin';
    }
}
