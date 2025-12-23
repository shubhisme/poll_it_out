import React, { useEffect, useState } from "react";

export default function Poll_timer({exp_at, onExpire} : {exp_at: Date | string, onExpire?: () => void}) {

    const [displayTime , setDisplaytime] = useState<string | null>(null);

    useEffect(()=>{
        console.log({exp_at : exp_at});
        if(!exp_at){return;}

        const timer = new Date(exp_at).getTime();

        const updateTimer = ()=>{
            const now = Date.now();
            const diff = timer - now

            if(diff <= 0){
                setDisplaytime("0:00");
                if(onExpire) onExpire();
                return;
            }

            const mins = Math.floor(diff / 1000 /60);
            const sec = Math.floor((diff / 1000) % 60);
            const formattedSec = sec < 10 ? `0${sec}` : sec;

            setDisplaytime(`${mins}:${formattedSec}`);
        }

        updateTimer();

        const interval = setInterval(updateTimer , 1000);

        return ()=> clearInterval(interval);
    } , [exp_at, onExpire])

    if (!exp_at) return <span>∞ Forever</span>;
    if (!displayTime) return <span>Loading...</span>;

    return (
        <div className={`text-lg font-bold text-foreground ${displayTime === "0:00" ? "text-red-500" : ""}`}>
            {displayTime}
        </div>
    )
}