$(function() {
	var transitionend = (function (){
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
		  'transition'       :'transitionend',
		  'OTransition'      :'oTransitionEnd',
		  'MSTransition'     :'msTransitionEnd',
		  'MozTransition'    :'transitionend',
		  'WebkitTransition' :'webkitTransitionEnd'
		}

		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	} ());
	var page1 = {
		_frames:0,
		_f1Completed:0,
		_resetStates: function() {
			this._frames = 0;
			this._f1Completed = 0;
		},
		init: function() {
			$('.page1 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			$('.bg-img').css('bottom',$('.small-images').height());
			var $centerTopic = $('.center-topic');
			$centerTopic.css({'margin-top': ($centerTopic.height() / -2) + 'px',
				'margin-left': ($centerTopic.width() / -2) + 'px'});
			var $center = $('.center-topic .center');
			$center.css({'margin-top': ($center.height() / -2) + 'px'});
			$('.small-images img').each(function() {
				var $this = $(this);
				$this.css('height', $this.width());
			});
			
			var imgs = $('.small-images img');
			$('.small-images').removeClass('off-screen').addClass('on-screen');
			var self = this;
			imgs.on(transitionend, function(e) {
				self._f1Completed++;
				if (self._f1Completed == imgs.length) {
					self._frames++;
					PubSub.publish('f' + self._frames);
				}
				e.stopPropagation();
			});
			$('.center-topic').on(transitionend, function(e) {
				self._frames++;
				PubSub.publish('f'+self._frames);
				e.stopPropagation();
			});
			PubSub.subscribe('f1', function() {
				$('.bg-img').removeClass('off-screen').addClass('on-screen');
				$('.center-topic').removeClass('off-screen').addClass('on-screen');
			});
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			this._resetStates();
			$($('.page')[0]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			$('.small-images').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page2 = {
		init: function() {
			$('.page2 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
		},
		enter: function() {
			$($('.page')[1]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			$('.page2 p').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page3 = {
		init: function() {
			$('.page3 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
		},
		enter: function() {
			$($('.page')[2]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			$('.page3 img').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page4 = {
		_frames:0,
		_f1Completed:0,
		_resetStates: function() {
			this._frames = 0;
			this._f1Completed = 0;
		},
		init: function() {
			var self = this;
			if (this.initialized) return;
			$('.page4 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			$('.page4 .text-block').css('height', ($('.page4').height() - $('.page4 img').height()) + 'px');
			$('.page4 img').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
				self._f1Completed++;
				if (self._f1Completed == 2) {
					self._frames++;
					PubSub.publish('f'+self._frames);
				}
			});
			PubSub.subscribe('f1', function() {
				$('.page4 p').removeClass('off-screen').addClass('on-screen');
			});
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			$($('.page')[3]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			var self = this;
			this._resetStates();
			var $textBlock = $('.page4 .text-block');
			$('.page4 img').removeClass('off-screen').addClass('on-screen');
			$textBlock.css({'top':$textBlock.height() + 'px', 'opacity':0})
					  .removeClass('off-screen');
			setTimeout(function() {
				  $textBlock.addClass('on-screen').animate({'top':'0px','opacity': 1}, 1000, 'linear', function() {
					self._f1Completed++;
					if (self._f1Completed == 2) {
						self._frames++;
						PubSub.publish('f'+self._frames);
					}
				  });
			  }, 0);
		},
		leave: function() {
		},
		initialized: false
	};
	var page5 = {
		init: function() {
			if (this.initialized) return;
			$('.page5 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			$($('.page')[4]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			$('.page5 img').removeClass('off-screen').addClass('on-screen');
			$('.page5 p').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page6 = {
		_f1Completed:0,
		_frames:0,
		_resetStates: function() {
			this._f1Completed = 0;
			this._frames = 0;
		},
		init: function() {
			var self = this;
			if (this.initialized) return;
			$('.page6 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			function _cb() {
				self._f1Completed++;
				if (self._f1Completed == 2) {					
					$('.page6 img:last-child').removeClass('off-screen').addClass('on-screen');
					$('.page6 section:last-child').removeClass('off-screen').addClass('on-screen');
				}
			}
			$('.page6 img:first-child').on(transitionend, _cb);
			$('.page6 section:first-child').on(transitionend, _cb);
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			$($('.page')[5]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			this._resetStates();
			$('.page6 img:first-child').removeClass('off-screen').addClass('on-screen');
			$('.page6 section:first-child').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page7 = {
		_f1Completed:0,
		_frames:0,
		_resetStates: function() {
			this._f1Completed = 0;
			this._frames = 0;
		},
		init: function() {
			var self = this;
			if (this.initialized) return;
			$('.page7 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			function _cb() {
				self._f1Completed++;
				if (self._f1Completed == 2) {					
					$('.page7 img:last-child').removeClass('off-screen').addClass('on-screen');
					$('.page7 section:last-child').removeClass('off-screen').addClass('on-screen');
				}
			}
			$('.page7 img:first-child').on(transitionend, _cb);
			$('.page7 section:first-child').on(transitionend, _cb);
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			$($('.page')[6]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			this._resetStates();
			$('.page7 img:first-child').removeClass('off-screen').addClass('on-screen');
			$('.page7 section:first-child').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page8 = {
		init: function() {
			var self = this;
			if (this.initialized) return;
			$('.page8 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			$($('.page')[7]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			$('.page8 h3').removeClass('off-screen').addClass('on-screen');
			$('.page8 p').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page9 = {
		_frames:0,
		_f1Completed:0,
		_resetStates: function() {
			this._frames = 0;
			this._f1Completed = 0;
		},
		init: function() {
			var self = this;
			if (this.initialized) return;
			$('.page9 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			$('.page9 .logo p').on(transitionend, function() {
				self._f1Completed++;
				if (self._f1Completed == 2) {
					self._frames++;
					PubSub.publish('f'+self._frames);
				}
			});
			$('.page9 .logo img').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', 
					function() {
				self._f1Completed++;
				if (self._f1Completed == 2) {
					self._frames++;
					PubSub.publish('f'+self._frames);
				}
			});
			$('.page9 img').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', 
					function(e) {
				self._frames++;
				PubSub.publish('f'+self._frames);
			});

			PubSub.subscribe('f1', function() {
				$('.page9 .logo p').removeClass('off-screen').addClass('on-screen');
				$('.page9 .logo img').removeClass('off-screen').addClass('on-screen');
			});
			PubSub.subscribe('f2', function() {
				$('.page9 .play-video').removeClass('off-screen').addClass('on-screen');
			});
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			$($('.page')[8]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			this._resetStates();
			$('.page9 img.app-snapshot').removeClass('off-screen').addClass('on-screen');
		},
		leave: function() {
		},
		initialized: false
	};
	var page10 = {
		init: function() {
			var self = this;
			if (this.initialized) return;
			$('.page10 .off-screen').on(transitionend, function(e) {
				e.stopPropagation();
			});
			//var $img = $('.page10 img');
			//$img.css('height', $img.width());
			$('.page10 section').css('height', ($('.page10').height() - $('.page10 img').height()) + 'px');
			this.initialized = true;
		},
		enter: function() {
			if (!this.initialized) this.init();
			$($('.page')[9]).addClass('active').removeClass('leave')
							.css('top', headHeight + 'px');
		},
		act: function() {
			var $section = $('.page10 section');
			$('.page10 img').removeClass('off-screen').addClass('on-screen');
			$section.css('top', $section.height()+'px').removeClass('off-screen');
			setTimeout(function() {
				$section.addClass('on-screen').animate({top:'0px'}, 1000, 'linear', function() {
					$('.page10 article').removeClass('off-screen').addClass('on-screen');
				});
			}, 0);
		},
		leave: function() {
		},
		initialized: false
	};
	var page = -1, pages = [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10];
	function next() {
		if (page >= (pages.length - 1)) {
			isRun = false;
			return;
		}
		if (page > -1) $($('.page')[page]).addClass('leave').css('top', -window.innerHeight + 'px');
		
		page++;
	}
	function prev() {
		if (page < 1){
			isRun = false;
			return;
		}
		if (page < pages.length) $($('.page')[page]).addClass('leave').css('top', -window.innerHeight + 'px');
			
		page--;
	}
	var hammer = new Hammer($('.pages')[0]);
	hammer.get('pan').set({direction:Hammer.DIRECTION_VERTICAL});
	var isRun = false;
	var headHeight = $('.head').height();
	hammer.on('panup swipeup', function() {
		if (isRun) return;
		isRun = true;
		next();
	}).on('pandown swipedown', function() {
		if (isRun) return;
		isRun = true;
		prev();
	});
	var $videoMask = $('.video-mask');
	$('.page9 .play-video').on('click', function() {
		$videoMask.append($('<iframe name="maidanxia_videio" src="http://v.qq.com/iframe/player.html?vid=g01649savzo&tiny=0&auto=0" allowfullscreen="" frameborder="0"></iframe>'));
		$videoMask.addClass('open');
	});
	$('.video-mask .close-mask').on('click', function() {
		$videoMask.removeClass('open');
		$('.video-mask iframe').remove();
	});
	setTimeout(function() {
		$('.page').css({
				'height': (window.innerHeight - headHeight)+'px',
				'top':window.innerHeight+'px'
			})
			.on(transitionend, function() {
				var $this = $(this);
				if ($(this).hasClass('leave')) {
					$('.page.leave:not(.page' + (page+1) + ')').each(function() {
						$(this).removeClass('leave active');
						$('.on-screen', $(this)).removeClass('on-screen').addClass('off-screen');
					});
					pages[page].enter();
				} else if ($this.hasClass('active')) {
					pages[page].act();
					isRun = false;
					//pages[page].initialized = true;
				}
			});
		next();
		pages[page].enter();
	}, 300);
});
