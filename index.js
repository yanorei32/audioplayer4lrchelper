const ctx = new AudioContext();
let buf, src, playbackStartTime;

setInterval(() => {
	const timingE = document.getElementById('timing');

	const bpm = parseInt(document.getElementById('bpm').value);
	const bpb = parseInt(document.getElementById('bpb').value);
	const offset = parseFloat(document.getElementById('offset').value);

	if (src) {
		const t = ctx.currentTime - playbackStartTime;
		const b = (t - offset) / (60 / bpm);
		timingE.textContent = Math.floor((b / bpb) + 1) + "/" + Math.floor((b % bpb) + 1);
	} else {
		timingE.textContent = ".";
	}
}, 1000/60);

const initializedE = (bufList) => {
	buf = bufList[0];
	alert("Loaded");
};

const play_txt = (s) => {
	if (!/^\d+\/\d+$/.test(s)) return;

	const bpm = parseInt(document.getElementById('bpm').value);
	const bpb = parseInt(document.getElementById('bpb').value);
	const offset = parseFloat(document.getElementById('offset').value);

	const sa = s.split('/');
	play((60 / bpm) * ((parseInt(sa[0])-1) * bpb + (parseInt(sa[1])-1)) + offset);
};

const play = (t) => {
	playbackStartTime = ctx.currentTime - t;
	stop();
	src = ctx.createBufferSource();
	src.buffer = buf;
	src.connect(ctx.destination);
	src.start(0, t);
};

const stop = () => {
	if (src) src.stop();
};

const init = (e) => {
	const bufLoader = new BufferLoader(
		ctx,
		[ URL.createObjectURL(e.srcElement.files[0]) ],
		initializedE,
	);

	bufLoader.load();
};

document.getElementById('fileChooser').addEventListener('change', init);
document.getElementById('jmpBtn').addEventListener('click', () => { play_txt(document.getElementById('jmpTxt').value); });
document.getElementById('jmpTxt').addEventListener('keyup', (e) => { if (e.keyCode === 13) play_txt(document.getElementById('jmpTxt').value); });

