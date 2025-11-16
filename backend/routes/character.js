import { Router } from "express";

const router = Router();


const characters =  [
  {
    id: 'michael',
    name: 'Michael',
    role: 'Your Manager',
    avatarEmoji: '👨‍💼',
    vibe: 'A friendly but professional manager who wants to help you practice for your performance review.',
  },
  {
    id: 'angela',
    name: 'Angela',
    role: 'Your Colleague',
    avatarEmoji: '👩‍💻',
    vibe: 'A supportive colleague who is great for practicing casual conversations and discussing team projects.',
  },
  {
    id: 'alex',
    name: 'Alex',
    role: 'Your Friend',
    avatarEmoji: '😎',
    vibe: 'A cool and casual friend. Perfect for practicing informal English and everyday chat.',
  },
];


router.get('/', (req, res) => {
    res.json({
        success: true, 
        data: characters
    })
});


export default router;
