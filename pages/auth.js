import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // ذخیره اطلاعات کاربر در localStorage (اختیاری)
      localStorage.setItem('user', JSON.stringify(data.user));

      // رفتن به داشبورد
       window.location.href = '/dashboard';
    } else {
      setError(data.error || 'خطا در ورود به سیستم');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1f] text-white font-[Vazirmatn]">
      <div className="w-full max-w-sm bg-[#1c2940] p-6 rounded-lg shadow-lg">
        <h1 className="text-xl mb-4">ورود</h1>

        <input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-[#0a0f1f] text-white"
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-[#0a0f1f] text-white"
        />

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
        >
          ورود
        </button>
      </div>
    </div>
  );
}
