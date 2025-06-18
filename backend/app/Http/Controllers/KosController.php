<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kos;

class KosController extends Controller
{
    public function index(Request $request)
    {
        $query = Kos::query();

        if($request->has('capacity')) {
            $capacity = $request->input('capacity');

            if($capacity == '4+') {
                $query->where('capacity', '>=', 4);
            }else{
                $query->where('capacity', '=', (int)$capacity);
            }
        }

        if ($request->has('keyword')) {
            $keyword = strtolower($request->input('keyword'));

             $query->where(function ($q) use ($keyword) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%$keyword%"])
                ->orWhereRaw('LOWER(address) LIKE ?', ["%$keyword%"])
                ->orWhereRaw('LOWER(JSON_EXTRACT(includes, "$[*]")) LIKE ?', ["%$keyword%"])
                ->orWhereRaw('LOWER(JSON_EXTRACT(nearby_facilities, "$[*]")) LIKE ?', ["%$keyword%"]);
            });
        }

        $kos = $query->get();

        return response()->json($kos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'address' => 'required',
            'location' => 'required',
            'includes' => 'required|array',
            'nearby_facilities' => 'nullable|array',
            'price_per_month' => 'required|numeric',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
            'contact_whatsapp' => 'nullable|string',
            'capacity' => 'required|numeric'
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $imagePaths[] = $img->store('kos_images', 'public');
            }
        }

        $kos = Kos::create([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'location' => $validated['location'],
            'includes' => $validated['includes'],
            'nearby_facilities' => $validated['nearby_facilities'] ?? [],
            'price_per_month' => $validated['price_per_month'],
            'contact_whatsapp' => $validated['contact_whatsapp'] ?? null,
            'capacity' => $validated['capacity'],
            'images' => $imagePaths,
        ]);

        return response()->json($kos, 201);
    }

    public function show(Kos $kos)
    {
        return $kos->load(['reviews.user']);
    }

    public function update(Request $request, Kos $kos)
    {
        $kos->update($request->all());
        return $kos;
    }

    public function destroy(Kos $kos)
    {
        $kos->delete();
        return response()->json([
            'message' => 'Kos deleted successfully.'
        ], 200);
    }
}
