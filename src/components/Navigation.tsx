// import { useAuth } from '@/hooks/useAuth';
// import { Button } from '@/components/ui/button';

// export function Navigation() {
//   const { user, signInWithGoogle, signOut, loading } = useAuth();

//   return (
//     <nav className="flex items-center justify-between p-4">
//       {/* Other navigation items */}
      
//       <div>
//         {loading ? (
//           <Button disabled>Loading...</Button>
//         ) : user ? (
//           <Button 
//             variant="outline" 
//             onClick={signOut}
//             className="flex items-center gap-2"
//           >
//             {user.user_metadata?.avatar_url && (
//               <img 
//                 src={user.user_metadata.avatar_url} 
//                 alt="Profile" 
//                 className="w-6 h-6 rounded-full"
//               />
//             )}
//             Sign Out
//           </Button>
//         ) : (
//           <Button 
//             onClick={signInWithGoogle}
//             className="flex items-center gap-2"
//           >
//             <img 
//               src="/google-icon.svg" 
//               alt="Google" 
//               className="w-5 h-5"
//             />
//             Sign in with Google
//           </Button>
//         )}
//       </div>
//     </nav>
//   );
// } 