function trigrams(s) {
  const words = (s.toLowerCase().match(/\b\w+\b/g) || []);
  const out = new Set();
  for (let i=0; i+2<words.length; i++) out.add(`${words[i]} ${words[i+1]} ${words[i+2]}`);
  return out;
}
function jaccard3(a,b) {
  const A = trigrams(a), B = trigrams(b);
  if (A.size===0 && B.size===0) return 1;
  const inter = [...A].filter(x => B.has(x)).length;
  const union = A.size + B.size - inter;
  return union ? inter/union : 0;
}
function isNearDuplicate(a,b,th=0.6){ return jaccard3(a,b) > th; }

module.exports = { isNearDuplicate };