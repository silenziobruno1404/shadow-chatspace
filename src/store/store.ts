
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type College = {
  id: string;
  name: string;
  level: 'undergraduate' | 'postgraduate';
};

export type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  roomId: string;
};

export type Room = {
  id: string;
  name: string;
  college: string | null; // null means global room
};

export type User = {
  nickname: string;
  college: College | null;
  loggedIn: boolean;
};

interface AppState {
  user: User;
  rooms: Room[];
  messages: Message[];
  colleges: College[];
  activeRoomId: string | null;
  isLoading: boolean;
  fetchingColleges: boolean;

  // Login actions
  setUser: (user: Partial<User>) => void;
  login: (nickname: string, college: College | null) => void;
  logout: () => void;

  // Room actions
  setRooms: (rooms: Room[]) => void;
  setActiveRoom: (roomId: string | null) => void;

  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  
  // College actions
  setColleges: (colleges: College[]) => void;
  setFetchingColleges: (fetching: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        nickname: '',
        college: null,
        loggedIn: false,
      },
      rooms: [
        { id: 'global', name: 'Global Chat', college: null },
      ],
      messages: [],
      colleges: [],
      activeRoomId: null,
      isLoading: false,
      fetchingColleges: false,

      setUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
      
      login: (nickname, college) => set((state) => {
        // Create college-specific room if a college is selected
        let updatedRooms = [...state.rooms];
        if (college) {
          const collegeRoomExists = updatedRooms.some(room => room.college === college.id);
          if (!collegeRoomExists) {
            updatedRooms.push({
              id: `college-${college.id}`,
              name: `${college.name} Chat`,
              college: college.id
            });
          }
        }
        
        return {
          user: {
            nickname,
            college,
            loggedIn: true
          },
          rooms: updatedRooms,
          activeRoomId: college ? `college-${college.id}` : 'global'
        };
      }),
      
      logout: () => set({ 
        user: { nickname: '', college: null, loggedIn: false },
        activeRoomId: null
      }),

      setRooms: (rooms) => set({ rooms }),
      
      setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

      addMessage: (messageData) => set((state) => ({
        messages: [
          ...state.messages, 
          { 
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            ...messageData
          }
        ]
      })),

      setColleges: (colleges) => set({ colleges }),
      
      setFetchingColleges: (fetchingColleges) => set({ fetchingColleges }),
      
      setIsLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'shadow-net-storage',
    }
  )
);
