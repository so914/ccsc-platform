<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query()
            ->withCount('contests')
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/categories/form', ['category' => null]);
    }

    public function store(Request $request)
    {
        Category::create($this->validated($request, null));

        return redirect()->route('admin.categories.index')->with('success', 'Catégorie créée.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('admin/categories/form', ['category' => $category]);
    }

    public function update(Request $request, Category $category)
    {
        $category->update($this->validated($request, $category));

        return redirect()->route('admin.categories.index')->with('success', 'Catégorie mise à jour.');
    }

    private function validated(Request $request, ?Category $category): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'.($category ? ','.$category->id : '')],
            'description' => ['nullable', 'string'],
            'active' => ['boolean'],
        ]);
    }
}
