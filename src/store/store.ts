
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

export type JoinRequest = {
  id: string;
  userId: string;
  nickname: string;
  roomId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
};

export type Room = {
  id: string;
  name: string;
  college: string | null; // null means global room
  moderators: string[]; // userIds of moderators for this room
};

export type User = {
  id: string;
  nickname: string;
  email: string | null;
  college: College | null;
  loggedIn: boolean;
  joinedRooms: string[]; // roomIds that user has access to
};

interface AppState {
  user: User;
  rooms: Room[];
  messages: Message[];
  colleges: College[];
  joinRequests: JoinRequest[];
  activeRoomId: string | null;
  isLoading: boolean;
  fetchingColleges: boolean;

  // Login actions
  setUser: (user: Partial<User>) => void;
  login: (nickname: string, email: string | null, college: College | null) => void;
  logout: () => void;

  // Room actions
  setRooms: (rooms: Room[]) => void;
  setActiveRoom: (roomId: string | null) => void;
  joinRoom: (roomId: string) => void;
  requestToJoinRoom: (roomId: string) => void;

  // Join request actions
  handleJoinRequest: (requestId: string, status: 'approved' | 'rejected') => void;
  
  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  
  // College actions
  setColleges: (colleges: College[]) => void;
  setFetchingColleges: (fetching: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: '',
        nickname: '',
        email: null,
        college: null,
        loggedIn: false,
        joinedRooms: [],
      },
      rooms: [
        { 
          id: 'global', 
          name: 'Global Chat', 
          college: null,
          moderators: [] 
        },
      ],
      messages: [],
      colleges: [],
      joinRequests: [],
      activeRoomId: null,
      isLoading: false,
      fetchingColleges: false,

      setUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
      
      login: (nickname, email, college) => set((state) => {
        // Create user ID if it doesn't exist
        const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create college-specific room if a college is selected
        let updatedRooms = [...state.rooms];
        let joinedRooms = ['global']; // All users join global by default
        
        if (college) {
          const collegeRoomId = `college-${college.id}`;
          const collegeRoomExists = updatedRooms.some(room => room.id === collegeRoomId);
          
          if (!collegeRoomExists) {
            updatedRooms.push({
              id: collegeRoomId,
              name: `${college.name} Chat`,
              college: college.id,
              moderators: [userId] // Make the first user from a college a moderator
            });
          } else {
            // Add user as moderator if they have a verified college email
            if (email && email.endsWith(`@${college.id}.edu`)) {
              updatedRooms = updatedRooms.map(room => 
                room.id === collegeRoomId
                  ? { ...room, moderators: [...room.moderators, userId] }
                  : room
              );
            }
          }
          
          joinedRooms.push(collegeRoomId);
        }
        
        return {
          user: {
            id: userId,
            nickname,
            email,
            college,
            loggedIn: true,
            joinedRooms
          },
          rooms: updatedRooms,
          activeRoomId: college ? `college-${college.id}` : 'global'
        };
      }),
      
      logout: () => set({ 
        user: { id: '', nickname: '', email: null, college: null, loggedIn: false, joinedRooms: [] },
        activeRoomId: null
      }),

      setRooms: (rooms) => set({ rooms }),
      
      setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

      joinRoom: (roomId) => set(state => ({
        user: {
          ...state.user,
          joinedRooms: [...new Set([...state.user.joinedRooms, roomId])]
        }
      })),

      requestToJoinRoom: (roomId) => set(state => {
        const { user } = state;
        // Create new join request
        const newRequest: JoinRequest = {
          id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          nickname: user.nickname,
          roomId,
          status: 'pending',
          timestamp: Date.now()
        };
        
        return {
          joinRequests: [...state.joinRequests, newRequest]
        };
      }),

      handleJoinRequest: (requestId, status) => set(state => {
        const request = state.joinRequests.find(req => req.id === requestId);
        if (!request) return state;
        
        let updatedJoinRequests = state.joinRequests.map(req => 
          req.id === requestId ? { ...req, status } : req
        );
        
        // If approved, add the user to the room
        let userJoinedRooms = [...state.user.joinedRooms];
        if (status === 'approved' && request.userId === state.user.id) {
          userJoinedRooms = [...new Set([...userJoinedRooms, request.roomId])];
        }
        
        return {
          joinRequests: updatedJoinRequests,
          user: {
            ...state.user,
            joinedRooms: userJoinedRooms
          }
        };
      }),

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
