import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';

function Signup() {
  const { isInitialized } = useContext(AuthContext);
  
  useEffect(() => {
    if (isInitialized) {
      // Show signup UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSignup("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md space-y-8 p-8 bg-slate-900 rounded-lg shadow-md border border-slate-700">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white text-2xl 2xl:text-3xl font-bold">
            준
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold text-slate-100">
              준태스쿨 계정 만들기
            </div>
            <div className="text-center text-sm text-slate-400">
              계정을 만들어 시작해보세요
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-slate-400">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;