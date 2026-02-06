package com.example.musicapp

import android.Manifest
import android.app.Activity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.musicapp.ui.theme.MusicappTheme

class MainActivity : Activity() {

    private lateinit var adapter: StreamAdapter
    private lateinit var streams: MutableList<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        streams = Settings.loadStreams(this)
        adapter = StreamAdapter(streams)

        findViewById<RecyclerView>(R.id.streamsList).apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = this@MainActivity.adapter
        }

        findViewById<EditText>(R.id.bluetoothNameInput)
            .setText(Settings.loadBluetoothName(this))

        findViewById<Button>(R.id.addStreamButton).setOnClickListener {
            streams.add(String())
            adapter.notifyItemInserted(streams.lastIndex)
        }

        findViewById<Button>(R.id.saveButton).setOnClickListener {
            val btName =
                findViewById<EditText>(R.id.bluetoothNameInput).text.toString()

            Settings.saveBluetoothName(this, btName)
            val newStreams = streams.toList().filterNot { it.isBlank() }
            Settings.saveStreams(this, newStreams)

            Toast.makeText(this, "Saved", Toast.LENGTH_SHORT).show()
        }
        requestPermissions(
            arrayOf(Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.POST_NOTIFICATIONS
            ),
            100
        )
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MusicappTheme {
        Greeting("Android")
    }
}