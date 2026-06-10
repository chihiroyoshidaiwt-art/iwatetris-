export default function GalaxyTrain({ bottom = 148 }) {
  return (
    <div style={{ position: 'fixed', bottom, left: 0, right: 0, zIndex: 1, height: 46, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2.5, background: 'linear-gradient(90deg,transparent,rgba(128,192,255,.58) 10%,rgba(158,218,255,.76) 50%,rgba(128,192,255,.58) 90%,transparent)' }} />
      <div style={{ position: 'absolute', bottom: 2, animation: 'trainRide 22s 1s linear infinite', display: 'flex', alignItems: 'flex-end', gap: 2 }}>
        {/* 機関車 */}
        <div style={{ width: 68, height: 38, position: 'relative', flexShrink: 0, background: 'linear-gradient(180deg,#1c3868,#0d2040 58%,#07142c)', borderRadius: '6px 6px 0 0', border: '1.5px solid rgba(118,175,255,.65)' }}>
          <div style={{ position: 'absolute', top: -11, left: 11, width: 11, height: 11, background: '#0d2040', border: '1px solid rgba(98,155,255,.48)', borderRadius: '2px 2px 0 0' }} />
          {[0, 1, 2].map(i => (<div key={i} style={{ position: 'absolute', top: -17 - i * 4, left: 13 + i * 3, width: 5 - i, height: 5 - i, borderRadius: '50%', background: `rgba(175,206,255,${.27 - i * .07})`, animation: `smoke ${.82 + i * .28}s ${i * .2}s infinite` }} />))}
          <div style={{ position: 'absolute', right: 3, top: 9, width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,250,168,1)', boxShadow: '0 0 12px rgba(255,238,112,1)', animation: 'hlight 1.25s infinite' }} />
          {[0, 1].map(i => (<div key={i} style={{ position: 'absolute', top: 7, left: 10 + i * 22, width: 13, height: 10, borderRadius: 2, background: `rgba(255,248,${154 + i * 22},.9)`, animation: `wblink ${1.08 + i * .4}s ${i * .46}s infinite` }} />))}
          {[7, 31, 56].map((x, i) => (<div key={i} style={{ position: 'absolute', bottom: -5, left: x, width: 10, height: 10, borderRadius: '50%', background: '#07142c', border: '2px solid rgba(118,165,255,.65)' }} />))}
        </div>
        {/* 客車 */}
        {[...Array(6)].map((_, ci) => (
          <div key={ci} style={{ width: 54, height: 30, position: 'relative', flexShrink: 0, background: `linear-gradient(180deg,${ci % 2 === 0 ? '#122b56' : '#0e2146'},#091a3a 68%,#050e1e)`, borderRadius: '4px 4px 0 0', border: '1px solid rgba(78,135,222,.48)' }}>
            {[3, 19, 35].map((x, wi) => (<div key={wi} style={{ position: 'absolute', top: 5, left: x, width: 12, height: 8, borderRadius: 2, background: `rgba(255,246,${154 + wi * 17},.8)`, animation: `wblink ${1.16 + wi * .2 + ci * .1}s ${wi * .27 + ci * .13}s infinite` }} />))}
            {[3, 32].map((x, i) => (<div key={i} style={{ position: 'absolute', bottom: -4, left: x, width: 8, height: 8, borderRadius: '50%', background: '#050e1e', border: '1.8px solid rgba(78,126,216,.5)' }} />))}
          </div>
        ))}
      </div>
    </div>
  )
}
