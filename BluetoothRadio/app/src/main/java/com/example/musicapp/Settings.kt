package com.example.musicapp

import android.content.Context
import androidx.core.content.edit
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object Settings {

    private const val PREFS = "audio_settings"
    private const val KEY_STREAMS = "streams"
    private const val KEY_BT_NAME = "bt_name"

    fun saveStreams(context: Context, streams: List<String>) {
        val json = Gson().toJson(streams)
        prefs(context).edit { putString(KEY_STREAMS, json) }
    }

    fun loadStreams(context: Context): MutableList<String> {
        val json = prefs(context).getString(KEY_STREAMS, null)
            ?: return mutableListOf()

        return Gson().fromJson(json, object : TypeToken<MutableList<String>>() {}.type)
    }

    fun saveBluetoothName(context: Context, name: String) {
        prefs(context).edit { putString(KEY_BT_NAME, name) }
    }

    fun loadBluetoothName(context: Context): String =
        prefs(context).getString(KEY_BT_NAME, "") ?: ""

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
}