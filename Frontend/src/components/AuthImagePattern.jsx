import React from 'react'
import { Bot, BotMessageSquare, MessageCircleHeart, MessageCircleMore, HandHeart, Clover, SmilePlus, PartyPopper, Star } from 'lucide-react'
import '../styles/forAuthImage.css'

    function AuthImagePattern({ title, subtitle }) {
        let ar = [<Bot />, <BotMessageSquare />, <MessageCircleHeart />, <MessageCircleMore />, <HandHeart />, <Clover />, <SmilePlus />, <PartyPopper />, <Star />]
        return (
            <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
                <div className="max-w-md text-center">
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-2xl bg-primary/10 flex justify-center items-center ${i % 2 === 0 ? "even-pulse" : "odd-pulse"
                                    }`}
                            >
                                {ar[i]}
                            </div>
                        ))}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    <p className="text-base-content/60">{subtitle}</p>
                </div>
            </div>
        );
    };

export default AuthImagePattern