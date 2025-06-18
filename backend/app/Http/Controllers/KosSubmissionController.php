<?php

namespace App\Http\Controllers;

use App\Models\KosSubmission;
use Illuminate\Http\Request;

class KosSubmissionController extends Controller
{
    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $kos = KosSubmission::create($validated);

        return[
            'message' => 'Dorm Submission recieved!',
            'data' => $kos
        ];
    }

    public function index(){
        return KosSubmission::all();
    }
}
