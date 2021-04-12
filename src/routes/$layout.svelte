<script>
	import '../app.scss';
</script>

<main>
	<nav>
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
	.icon {
		width: 1rem;
		height: 1rem;
	}
</style>
