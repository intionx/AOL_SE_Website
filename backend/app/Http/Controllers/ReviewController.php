<?php

namespace App\Http\Controllers;

use App\Models\Kos;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Kos $kos){
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $review = new Review();
        $review->rating = $request->rating;
        $review->comment = $request->comment;
        $review->user_id = $request->user()->id;
        $review->kos_id = $kos->id;
        $review->save();

        return $review->load('user');
    }
}
