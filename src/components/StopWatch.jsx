import { useState, useRef } from "react";
import './StopWatch.css'

export default function Stopwatch() {
    const [startTime, setStartTime] = useState(0);
    const [now, setNow] = useState(0);
    const [timestamps, setTimestamps] = useState([])
    const [stopped, setStopped] = useState(false)

    const intervalRef = useRef(null);

    const start = () => {
        if (intervalRef.current !== null) {
            return
        }
        setStartTime(Date.now())

        intervalRef.current = setInterval(() => {
            setNow((p) => p + 10)
        }, 10)
    }

    const stop = () => {
        if (intervalRef.current !== null) {
            clearTimeout(intervalRef.current)
            intervalRef.current = null
        } else {
            start(true)
        }

        setStopped((prev) => !prev)
    }

    const pad = (num, size) => {
        return String(num).padStart(size, '0');
    }

    const formatNow = (n) => {
        const totalSeconds = Math.floor(n / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);

        return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
    }

    const reset = () => {
        clearTimeout(intervalRef.current)
        intervalRef.current = null
        setStopped(false)
        setNow(0)
        setStartTime(0)
        setTimestamps([])
    }

    const registerTimestamp = () => {
        setTimestamps((prev) => {
            return [...prev, now]
        })
    }

    return (
        <main>
            <h1>Cronómetro</h1>
            <div className="content">
                <div className="timer">
                    <p>{formatNow(now)}</p>
                    <p className="ms">{pad(now % 1000, 3)}</p>
                </div>

                <div className="btns">
                    <button className={startTime === 0 ? '' : 'outline'} disabled={startTime !== 0} onClick={start}>
                        Empezar
                    </button>

                    <button className={startTime === 0 ? 'outline' : ''} disabled={startTime === 0} onClick={registerTimestamp}>
                        Registrar marca
                    </button>

                    <button className={startTime === 0 ? 'outline' : ''} disabled={startTime === 0} onClick={stop}>
                        {stopped ? 'Reanudar' : 'Pausar'}
                    </button>

                    <button className={now === 0 ? 'outline' : ''} disabled={now === 0} onClick={reset}>
                        Resetear
                    </button>
                </div>
            </div>

            {timestamps.length > 0 && (
                <div className="content">
                    <h2>Marcas</h2>

                    <table>
                        <thead>
                            <tr>
                                <td>Número</td>
                                <td>Diferencia</td>
                                <td>Accumulado</td>
                            </tr>
                        </thead>
                        <tbody>
                            {timestamps.map((t, i) => [t, i]).toReversed().map(([t, i]) => {
                                const prev = i === 0 ? t : t - timestamps[i - 1];
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <div className="timer">
                                                <p>{formatNow(prev)}</p>
                                                <p className="ms">{pad(prev % 1000, 3)}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="timer">
                                                <p>{formatNow(t)}</p>
                                                <p className="ms">{pad(t % 1000, 3)}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>


                </div>
            )}
        </main>

    )
}