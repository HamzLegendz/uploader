import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [welcomePopup, setWelcomePopup] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const handleUpload = async () => {
    if (!file) return setError('Please select a file.');
    setUploading(true);
    setError('');
    const form = new FormData();
    form.append('file', file);
    if (customName) form.append('customName', customName);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    setUploading(false);
    if (data?.url) {
      setUrl(data.url);
    } else {
      setError('Upload failed.');
    }
  };

  const handleWelcomePopup = () => {
    setWelcomePopup(false);
    setMusicPlaying(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/wallpaper.jpg")' }}
    >
      {welcomePopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h1 className="text-2xl font-bold mb-4">Selamat Datang di Upload Kami!</h1>
            <button
              onClick={handleWelcomePopup}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white shadow-xl rounded-xl p-6 mx-auto w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Catbox Clone Uploader</h1>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full mb-4 border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            placeholder="Custom File Name (Optional)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full mb-4 border border-gray-300 p-2 rounded"
          />
          {uploading ? (
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled
            >
              Uploading...
            </button>
          ) : (
            <button
              onClick={handleUpload}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Upload File
            </button>
          )}

          {url && (
            <div className="mt-4">
              <p className="text-green-600 font-semibold">Upload Successful!</p>
              <p className="text-blue-500">
                File URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              </p>
            </div>
          )}
          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}
        </div>
      </div>

      {musicPlaying && (
        <audio autoPlay loop>
          <source src="/music/background-music.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
