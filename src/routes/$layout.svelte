<script>
	import '../app.scss';
	import { view } from '$lib/store'
</script>

<main>
	<nav class={ $view === 'PageView' ? 'hidden' : ''}>
		<h1>CMView</h1>
		<ul>
			<li>
				<a href="/BookShelf">
					<img class="icon" src="home.svg" alt="home" />
				</a>
			</li>
			<li>
				<a href="/Config">
					<img class="icon" src="gear.svg" alt="gear" />
				</a>
			</li>
		</ul>
	</nav>
	<slot />
</main>

<style lang="scss">
	nav.hidden {
		display: none;
	}

	.icon {
		width: 1rem;
		height: 1rem;
	}
</style>
