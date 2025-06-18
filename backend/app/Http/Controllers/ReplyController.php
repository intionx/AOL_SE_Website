<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Reply;

class ReplyController extends Controller
{
    public function store(Request $request, Post $post){
        $request->validate([
            'body' => 'required|string'
        ]);

        $reply = new Reply();
        $reply->body = $request->body;
        $reply->user_id = $request->user()->id;
        $reply->post_id = $post->id;
        $reply->save();

        return $reply->load('user');
    }
}
