export let animation = {
  tableFadingLeft:function (animation) {
      document.getElementById('main-table').style.animationName = animation;
      setTimeout(function () {
         document.getElementById('main-table').style.animationName = 'none';
      }, 6000)
  },
    changeLoaderDisplay:function (noneOrBlock) {
        document.getElementsByClassName('loader')[0].style.display = noneOrBlock;
    }
};