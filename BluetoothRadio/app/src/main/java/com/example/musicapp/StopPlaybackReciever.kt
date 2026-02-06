package com.example.musicapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.annotation.OptIn
import androidx.media3.common.util.UnstableApi

class StopPlaybackReceiver : BroadcastReceiver() {
    @OptIn(UnstableApi::class)
    override fun onReceive(context: Context, intent: Intent) {
        val stopIntent = Intent(context, AudioService::class.java)
        context.stopService(stopIntent)
    }
}
